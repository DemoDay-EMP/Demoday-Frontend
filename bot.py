import mysql.connector
from flask import Flask, render_template, request, jsonify
import subprocess
from flask import Flask, render_template
from time import sleep
from time import localtime
from pyautogui import press
from webbrowser import open
from urllib.parse import quote
from pywhatkit.core.core import check_number
from pywhatkit.core.exceptions import CountryCodeException
from pywhatkit.core.log import log_message

app = Flask(__name__)

@app.route('/')

def index():
    return render_template('index.html')

@app.route('/executar_bot', methods=['POST'])
def executar_bot():
    try:
        # Coloque aqui o caminho real do seu script Python
        subprocess.run(['python', 'bot.py'])
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)

# Aqui está a parte do script MySQL
cnx = mysql.connector.connect(
    host="localhost",
    port=3306,
    user="root",
    password="root",
    database="emp",
    auth_plugin='mysql_native_password'
)

if cnx.is_connected():
    print("db OK")

cursor = cnx.cursor()

cursor.execute("SELECT telefone FROM Usuario_pf WHERE nome_cliente = 'Guilherme Alefe'")
debters = []
for (phone,) in cursor:
    phone_with_country_code = "+55" + phone
    debters.append(phone_with_country_code)

msg = "VOCÊ TEM DÍVIDAS PENDENTES!!!"

for phone in debters:
    if not check_number(number=phone):
        raise CountryCodeException("Código do País Ausente no Número de Telefone!")
    try:
        open(f"https://web.whatsapp.com/send?phone={phone}&text={quote(msg)}")
        sleep(15)
        press("enter")
        print("enter ok")
        log_message(_time=localtime(), receiver=phone, message=msg)
    except:
        print("error")
    print(phone)

cnx.close()
