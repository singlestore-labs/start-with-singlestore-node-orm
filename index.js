import Sequelize from 'sequelize';

// TODO: adjust these connection details to match your SingleStore deployment:
const HOST = 'localhost';
const PORT = 3306;
const USER = 'root';
const PASSWORD = 'password_here';
const DATABASE = 'acme';

// main is run at the end
async function main() {
  let sequelize;
  try {
    sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
      host: HOST,
      port: PORT,
      dialect: 'mysql'
    });

    const Message = init(sequelize);
    
    const id = await create({Message, content: 'Inserted row'});
    console.log(`Inserted row id ${id}`);

    const msg = await readOne({Message, id});
    console.log('Read one row:');
    if (msg == null) {
      console.log('not found');
    } else {
      console.log(`${msg.id}, ${msg.content}, ${msg.createdate}`);
    }

    await update({Message, id, content: 'Updated row'});
    console.log(`Updated row id ${id}`);

    const messages = await readAll({Message});
    console.log('Read all rows:');
    messages.forEach(m => {
      console.log(`${m.id}, ${m.content}, ${m.createdate}`);
    });

    await delete_({Message, id});
    
  } catch (err) {
    console.error('ERROR', {err});
    process.exit(1);
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
}

function init(sequelize) {
  const Message = sequelize.define('message', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    content: {
      type: Sequelize.STRING
    },
    createdate: {
      type: Sequelize.DATE
    }
  }, {
    timestamps: false
  });
  return Message;
}


async function create({Message, content}) {
  const toinsert = {
    content,
    createdate: new Date()
  };
  const result = await Message.create(toinsert);
  return result.id;
}

async function readOne({Message, id}) {
  return await Message.findByPk(id);
}

async function readAll({Message}) {
  return await Message.findAll();
}

async function update({Message, id, content}) {
  await Message.update({ content }, {
    where: { id }
  });
}

async function delete_({Message, id}) {
  await Message.destroy({
    where: { id }
  });
}

main();