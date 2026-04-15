import sqlite3

conn = sqlite3.connect('users.db')
cursor = conn.cursor()

cursor.execute('SELECT id, username, email FROM users')
rows = cursor.fetchall()

print('Stored Accounts:')
for row in rows:
    print(f'ID: {row[0]}, Username: {row[1]}, Email: {row[2]}')

conn.close()