import os
from flask import Flask, render_template, request, jsonify
import openai
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = os.getenv("OPENAI_API_URL")

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    try:
        response = openai.ChatCompletion.create(
            model=os.getenv("OPENAI_MODEL"),
            messages=[
                {"role": "system", "content": "أنت مساعد ذكي يتحدث بالعربية بطلاقة."},
                {"role": "user", "content": user_message}
            ],
        )

        reply = response.choices[0].message["content"]
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)