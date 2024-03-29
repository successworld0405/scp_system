from app import mongo, app
import csv, json
from bson.json_util import dumps

from pathlib import Path

base_path = Path(__file__).parent

def make_csv(username, id):
    query = {'$and': [{'username': username}, {'id': (id)}]}
    all_datas_cursor = mongo.db.scp_alldatas.find(query)    # Converting to the JSON 
    all_datas = json.loads(dumps(list(all_datas_cursor), indent = 2))

    csv_file_path = base_path / f"../../csv_files/{username}_{id}_output.csv"

    # Ensure the directory exists
    csv_file_path.parent.mkdir(parents=True, exist_ok=True)


    # Extract headers dynamically from the first document
    if len(all_datas) == 0:
        return False
    headers = list(all_datas[0]["data"].keys())

    # Add additional headers if needed
    # headers.extend(["_id", "id", "username", "title"])

    # Write MongoDB data to CSV file
    with open(csv_file_path, "w", newline="",  encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        
        # Write header
        writer.writeheader()
        
        # Write data rows
        for item in all_datas:
            # Extract data from "data" field
            data = item.pop("data")
            
            # Combine "data" with other fields
            row = {**data}
            
            writer.writerow(row)
    return True, csv_file_path
