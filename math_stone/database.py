import sqlite3

# This section utilizes a boilerplate database class taken stackoverflow
# https://stackoverflow.com/questions/38076220/python-mysqldb-connection-in-a-class

class Database:
    def __init__(self):
        self._conn = sqlite3.connect("math-stone.db")
        self._cursor = self._conn.cursor()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

    @property
    def connection(self):
        return self._conn

    @property
    def cursor(self):
        return self._cursor

    def commit(self):
        self.connection.commit()

    def close(self, commit=True):
        if commit:
            self.commit()
        self.connection.close()

    def execute(self, sql, params=None):
        self.cursor.execute(sql, params or ())

    def fetchall(self):
        return self.cursor.fetchall()

    def fetchone(self, sql, params=None):
        self.cursor.execute(sql, params or())
        return self.cursor.fetchone()

    def query(self, sql, params=None):
        self.cursor.execute(sql, params or ())
        return self.fetchall()

