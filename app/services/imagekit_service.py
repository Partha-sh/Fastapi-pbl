import os
from dotenv import load_dotenv
from imagekitio import ImageKit

load_dotenv()

imagekit = ImageKit(
    private_key=os.getenv("IMAGEKIT_PRIVATE_KEY")
)
print(os.getenv("IMAGEKIT_PRIVATE_KEY"))
print(os.getenv("IMAGEKIT_URL_ENDPOINT"))

def upload_image(file_bytes, file_name):
    try:
        response = imagekit.files.upload(
            file=file_bytes,
            file_name=file_name,
        )

        print(response)

        return response.url

    except Exception as e:
        print(type(e))
        print(e)
        raise