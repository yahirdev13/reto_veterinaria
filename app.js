const db = require('./db/connection');

const tiposMascotas = ['Perro', 'Gato', 'Pájaro', 'Conejo'];
const razasPerro = ['Labrador', 'Pastor Alemán', 'Bulldog', 'Golden Retriever'];
const razasGato = ['Siamés', 'Persa', 'Bengalí', 'Maine Coon'];

const crearCliente = () => {
    const nombres = ['Juan', 'María', 'Carlos', 'Laura', 'Pedro', 'Ana', 'Diego', 'Luisa', 'Daniel', 'Elena'];
    const apellidos = ['Gómez', 'Rodríguez', 'Fernández', 'López', 'Martínez', 'Pérez', 'Sánchez', 'González', 'Ruiz', 'Díaz'];

    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];

    return `${nombre} ${apellido}`;
}

const crearMascota = async (ownerId) => {
    const tipo = tiposMascotas[Math.floor(Math.random() * tiposMascotas.length)];
    const raza = tipo === 'Perro' ? razasPerro[Math.floor(Math.random() * razasPerro.length)] : razasGato[Math.floor(Math.random() * razasGato.length)];
    const nombre = tipo === 'Perro' ? 'Rex' : 'Misi';

    const sql = `INSERT INTO pets (name, type, breed, owner_id, created_at) VALUES (?, ?, ?, ?, ?)`;
    const values = [nombre, tipo, raza, ownerId, new Date()];

    await db.promise().query(sql, values);
}

const crearClienteYmascota = async () => {
    try {
        // Generar nombre de cliente aleatorio
        const nombreCliente = crearCliente();

        // Insertar cliente en la base de datos
        const sqlInsertCliente = `INSERT INTO clients (name, last_name, created_at) VALUES (?, ?, ?)`;
        const valuesCliente = [nombreCliente.split(' ')[0], nombreCliente.split(' ')[1], new Date()];
        const [resultCliente] = await db.promise().query(sqlInsertCliente, valuesCliente);
        const clientId = resultCliente.insertId;

        // Insertar mascota asociada al cliente
        await crearMascota(clientId);

        console.log('Cliente y mascota creados correctamente');
    } catch (error) {
        console.error('Error al crear cliente y mascota:', error);
    }
}

// Crear 5 clientes con mascotas
const crearClientesConMascotas = async () => {
    for (let i = 0; i < 5; i++) {
        await crearClienteYmascota();
    }
}

crearClientesConMascotas()
    .then(() => {
        console.log('Proceso completado.');
        db.end(); // Cerrar la conexión al finalizar
    })
    .catch(error => {
        console.error('Error en el proceso:', error);
        db.end(); // Cerrar la conexión en caso de error
    });
