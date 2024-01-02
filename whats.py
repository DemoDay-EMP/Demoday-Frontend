from flask import Flask, request, jsonify
from flask_cors import CORS
from time import sleep
from pyautogui import press
from webbrowser import open
from urllib.parse import quote

app = Flask(__name__)
CORS(app, resources={r"/executar-codigo": {"origins": "*"}})

print("Aplicação Flask iniciada com sucesso!")

@app.route('/executar-codigo', methods=['POST', 'OPTIONS'])
def executar_codigo():
    if request.method == 'OPTIONS':
        # Responder às solicitações OPTIONS
        response = app.make_default_options_response()
    else:
        # Tratar a solicitação POST normalmente
        data = request.get_json()
        wtelefone = data.get('telefone')
        wnome = data.get('nome')

        # Lógica simulada de envio de mensagem
        msg = f"{wnome}, você tem dívidas pendentes!!!"
        print(f"Simulando envio de mensagem para {wtelefone}: {msg}")

        # Simulando a abertura do WhatsApp Web
        try:
            open(f"https://web.whatsapp.com/send?phone={wtelefone}&text={quote(msg)}")
            sleep(15)  # Tempo para a página ser carregada
            press("enter")  # Simulando o pressionamento da tecla Enter
            print("Mensagem enviada com sucesso")
        except Exception as e:
            print(f"Erro ao enviar mensagem: {e}")

    response = jsonify({"status": "success"})
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    return response

if __name__ == '__main__':
    # Inicie a aplicação Flask
    app.run(debug=True)
