import requests
import concurrent.futures

# URL y JSON de solicitud
url = "http://127.0.0.1:8080/api/login"
payload = {
    "usuario": "empresa@prueba.com",
    "contra": "empresaprueba"
}
fails = 0


# Función para enviar una solicitud HTTP
def send_request(url, payload):
    # wait between 0.0 and 2.0 seconds
    import time
    import random
    time.sleep(random.random() * 2)

    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print("Solicitud exitosa")
        else:
            print(f"Fallo en la solicitud: {response.status_code}")
    except Exception as e:
        print(f"Error: {str(e)}")


# Número de hilos concurrentes
num_threads = 200  # Puedes ajustar este valor según tus necesidades

# Crear un ThreadPoolExecutor para enviar solicitudes concurrentes
with concurrent.futures.ThreadPoolExecutor(max_workers=num_threads) as executor:
    futures = [executor.submit(send_request, url, payload) for _ in range(num_threads)]

# Esperar a que todas las solicitudes se completen
concurrent.futures.wait(futures)
