import pandas as pd
import json

# Load the Excel file
excel_file = 'Sales_Dataset.xlsx'  # Replace with your actual file name
df = pd.read_excel(excel_file)

# Convert DataFrame to JSON
json_data = df.to_json(orient='records', date_format='iso')

# Save to a JSON file
with open('output.json', 'w') as json_file:
    json_file.write(json_data)

print("Excel data has been converted to JSON and saved to 'output.json'")
