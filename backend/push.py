import os
import sys
from dotenv import load_dotenv
from twilio.rest import Client

if len(sys.argv) <= 1:
    print('Usage: python push.py "text to push"')
    sys.exit(1)

load_dotenv()
client = Client()

sync_service = client.sync.services(os.environ.get('TWILIO_SYNC_SERVICE_SID'))
todo_list = sync_service.sync_lists('todoList')
todo_list.sync_list_items.create({'todo': sys.argv[1]})