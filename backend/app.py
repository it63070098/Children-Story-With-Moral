from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
 
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Flask backend!"})

def get_completion(messages, model="ft:gpt-3.5-turbo-0613:personal:cs-3:95DLQ5pu", temperature=0.7):

    completion = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature
        )
    return completion.choices[0].message.content


@app.route('/generate_story', methods=['POST'])
def generate_story():
    try:
        data = request.json
        age = data.get('age', '')
        moral = data.get('moral', '')
        genre = data.get('genre', '')
        messages=[
            {"role": "system", "content": "You are a writer that writes stories for kids. Include 10 scenes with exposition, rising action, climax, falling action, and resolution., provide the following fields in a JSON dict, where applicable: \"title\" (Eng Title), \"title_thai\" (Thai Title), \"cover\" (cover image generation prompt),\"synopsis\", \"scenes\"(10 scene),\"eng\"(eng scene) and \"image\"(prompt for image generation)."},
            {"role": "user", "content": f"Write a short story in English and Thai for [AGE]. It should teach [MORAL] and have a [THEME].do not use double quotes in each scene.Dialogue of characters should not be enclosed in double quotes or quotation marks. : MORAL = {moral}, THEME = {genre}, AGE = {age}"},
        ]

        generated_scenes = get_completion(messages)
        print(generated_scenes)
        return jsonify({
            "generated_scenes": generated_scenes
        })

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=True)
