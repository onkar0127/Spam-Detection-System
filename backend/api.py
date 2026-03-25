from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)


model = joblib.load("linear_svm_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")
label_encoder = joblib.load("label_encoder.pkl")

@app.route("/")
def home():
    return "ML API Running 🚀"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        text = data.get("text")
        if not text:
            return jsonify({"error": "No text provided"}), 400

    
        text_vector = vectorizer.transform([text])

   
        prediction = model.predict(text_vector)

  
        final_output = label_encoder.inverse_transform(prediction)[0]

        return jsonify({
            "input": text,
            "prediction": final_output
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000,debug=True)