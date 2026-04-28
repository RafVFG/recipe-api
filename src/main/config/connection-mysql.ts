import mysql from "mysql2";
import "dotenv/config";

export function connection() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    function execute<T>(query: string, params: any[] = []): Promise<T> {
        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if(error) return reject(error);

                connection.query(query, params, (error, data) => {
                    if(error) return reject(error);

                    connection.release();
                    return resolve(data as unknown as T);
                })
            })
        })
    }

    return {
        execute
    }
}