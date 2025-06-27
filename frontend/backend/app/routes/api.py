from flask import Blueprint,jsonify,render_template
from ..services.ATS_Engine import *
from flask import Response
from ..utils.jwt_required import jwt_required
import os
from flask import request

api_bp = Blueprint('api',__name__)
@api_bp.route('/score', methods=['POST', 'GET'])
def score():
    if request.method == 'POST':
        resume_file = request.files.get('resume')
        jd_file = request.files.get('jd')

        if not resume_file or not jd_file:
            return jsonify({"error": "Missing resume or JD file"}), 400

        os.makedirs('temp', exist_ok=True)
        resume_path = "temp/resume.pdf"
        jd_path = "temp/jd.pdf"
        resume_file.save(resume_path)
        jd_file.save(jd_path)
        return jsonify({"message": "Files uploaded successfully."}), 200


    elif request.method == 'GET':
        resume_path = "temp/resume.pdf"
        jd_path = "temp/jd.pdf"
        if not os.path.exists(resume_path) or not os.path.exists(jd_path):
            return jsonify({"error": "Files not found. Upload first via POST."}),
        resume_content = extract_text_from_resume(resume_path)
        jd_content = extract_text_from_jd(jd_path)

        # Add a sanity check for extracted content before scoring
        if not resume_content.strip() or not jd_content.strip():
            return jsonify({"error": "Failed to extract content from files."}), 400

        final_score = ATS_Score(resume_content, jd_content)
        return str(final_score)


    else:
        return jsonify({"error": "Invalid HTTP method"}), 405

    # Now, safely extract and score only if files exist
    

@api_bp.route('/analyse', methods=['GET'])
def analyse():
    resume_path = "temp/resume.pdf"
    if not os.path.exists(resume_path):
        return jsonify({"error": "Files not found. Upload first via POST."}), 400
    resume_content = extract_text_from_resume(resume_path)
    analysed_resume = parse_resume(resume_content)
    return analysed_resume

  
@api_bp.route('/create-resume',methods=['GET'])
@jwt_required
def resume_creation():
    resume_path = "temp/resume.pdf"
    if not os.path.exists(resume_path):
        return jsonify({"error": "Files not found. Upload first via POST."}), 400
    resume_text = extract_text_from_resume(resume_path)
    gen_resume = create_resume(resume_text)
    return Response(gen_resume, mimetype='text/html')
    
