exports.up = async function(knex) {
    // Table Ecole
    await knex.schema.createTable('Ecole', (table) => {
      table.increments('id').primary();
      table.string('raisonSocial').notNullable();
      table.date('dateCreation').notNullable();
      table.date('dateUpdated').notNullable();
      table.string('email').notNullable();
      table.string('NomRepresentant').notNullable();
      table.string('numero_telephone').notNullable();
      table.string('adresse').notNullable();
      table.binary('signature', 'mediumblob').notNullable(); // mediumBLOB MySQL
    });
  
    // Table ModelConvention
    await knex.schema.createTable('ModelConvention', (table) => {
      table.increments('id').primary();
      table.json('details').notNullable();
      table.integer('ecole_id').unsigned().notNullable().unique()
        .references('id').inTable('Ecole').onDelete('CASCADE');
    });
  
    // Table Entreprise
    await knex.schema.createTable('Entreprise', (table) => {
      table.increments('id').primary();
      table.string('NomRepresentant').notNullable();
      table.string('qualiteRepresentant').notNullable();
      table.string('email').notNullable();
      table.string('numero_telephone').notNullable();
      table.string('adresse').notNullable();
      table.binary('signature', 'mediumblob').notNullable();
    });
  
    // Table Etudiant
    await knex.schema.createTable('Etudiant', (table) => {
      table.increments('id').primary();
      table.string('Nom').notNullable();
      table.string('prenom').notNullable();
      table.string('adresse').notNullable();
      table.string('email').notNullable();
      table.string('numTel').notNullable();
      table.date('dateNaissance').notNullable();
      table.binary('signature', 'mediumblob').notNullable();
      table.integer('ecole_id').unsigned().notNullable()
        .references('id').inTable('Ecole').onDelete('CASCADE');
    });
  
    // Table Convention
    await knex.schema.createTable('Convention', (table) => {
      table.increments('id').primary();
      table.string('status').notNullable();
      table.date('dateCreation').notNullable();
      table.date('dateDebut').notNullable();
      table.date('dateFin').notNullable();
      table.json('details').notNullable();
  
      table.integer('entreprise_id').unsigned().notNullable()
        .references('id').inTable('Entreprise').onDelete('CASCADE');
      table.integer('etudiant_id').unsigned().notNullable()
        .references('id').inTable('Etudiant').onDelete('CASCADE');
      table.integer('ecole_id').unsigned().notNullable()
        .references('id').inTable('Ecole').onDelete('CASCADE');
    });
  };
  
  exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('Convention');
    await knex.schema.dropTableIfExists('Etudiant');
    await knex.schema.dropTableIfExists('Entreprise');
    await knex.schema.dropTableIfExists('ModelConvention');
    await knex.schema.dropTableIfExists('Ecole');
  };
  