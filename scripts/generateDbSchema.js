const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const modelsDir = path.join(__dirname, '..', 'models');
const outputPath = path.join(__dirname, '..', 'docs', 'db-schema.json');

const toPlainDefault = (value) => {
  if (typeof value === 'function') return '[Function]';
  if (value instanceof Date) return value.toISOString();
  return value;
};

const normalizeField = (pathDef) => {
  const info = {
    type: pathDef.instance,
    required: Boolean(pathDef.isRequired),
  };

  // Mongoose 9 exposes array item types as embeddedSchemaType (caster in older versions)
  const itemType = pathDef.embeddedSchemaType || pathDef.caster;
  if (pathDef.instance === 'Array' && itemType) {
    info.arrayOf = itemType.instance;
    if (itemType.options && itemType.options.ref) {
      info.ref = itemType.options.ref;
    }
  }

  const options = pathDef.options || {};

  if (options.ref) info.ref = options.ref;
  if (Array.isArray(options.enum) && options.enum.length > 0) info.enum = options.enum;
  if (options.default !== undefined) info.default = toPlainDefault(options.default);
  if (options.unique === true) info.unique = true;
  if (options.index === true) info.index = true;

  return info;
};

const extractSchema = (schema) => {
  const fields = {};
  schema.eachPath((fieldName, pathDef) => {
    fields[fieldName] = normalizeField(pathDef);
  });

  const virtuals = {};
  Object.entries(schema.virtuals).forEach(([virtualName, virtual]) => {
    const options = (virtual && virtual.options) || {};
    virtuals[virtualName] = {
      ref: options.ref,
      localField: options.localField,
      foreignField: options.foreignField,
      justOne: options.justOne,
    };
  });

  return {
    timestamps: Boolean(schema.options && schema.options.timestamps),
    fields,
    virtuals,
    indexes: schema.indexes(),
  };
};

const loadModels = () => {
  fs.readdirSync(modelsDir)
    .filter((fileName) => fileName.endsWith('.js'))
    .forEach((fileName) => require(path.join(modelsDir, fileName)));
};

const generateSchema = () => {
  loadModels();

  const models = {};
  mongoose.modelNames().forEach((modelName) => {
    const model = mongoose.model(modelName);
    models[modelName] = {
      collection: model.collection ? model.collection.name : undefined,
      ...extractSchema(model.schema),
    };
  });

  const output = {
    generatedAt: new Date().toISOString(),
    models,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);

  console.log(`DB schema written to ${path.relative(process.cwd(), outputPath)}`);
};

generateSchema();
