const fs = require("fs");
const path = require("path");

const directory = path.join(__dirname, "src");

function deleteJsFiles(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`El directorio ${dir} no existe.`);
        return;
    }

    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            deleteJsFiles(fullPath); // Llamada recursiva para subdirectorios
        } else if (path.extname(file) === ".js") {
            fs.unlinkSync(fullPath);
            console.log(`Borrado: ${fullPath}`);
        }
    }
}

deleteJsFiles(directory);
