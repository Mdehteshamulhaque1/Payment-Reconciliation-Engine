from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook/<provider>', methods=['POST'])
def webhook(provider):
    data = request.get_json() or {}
    # Placeholder: dispatch to handler
    return jsonify({'provider': provider, 'received': True})

if __name__ == '__main__':
    app.run(port=9000)
