import mysql from "mysql";

function getMysqlAdapter() {
    try {
        var mysqlConn = mysql.createConnection({
            host: "localhost",
            password: "nb4nvB543ttP9bsSt5$",
            user: "back_user",
            database: "backend_service"
        });
        mysqlConn.connect((error) => {
            if (error){
                console.log(error);
                return null;
            }
        });
        return mysqlConn;
    }catch(conErr){
        console.log(conErr);
        return null;
    }
}

export default getMysqlAdapter;