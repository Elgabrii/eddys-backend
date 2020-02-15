var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = (req, model) => {
  let selectQuery;
  let populateQuery;
  if (req.query.select) {
    selectQuery = req.query.select.split(',');
    delete req.query.select;
  }
  if (req.query.populate) {
    populateQuery = req.query.populate.split(',');
    delete req.query.populate;
  } else {
    populateQuery = [];
  }
  const criteria = actionUtil.parseCriteria(req);
  console.log('TCL: criteria', criteria);
  for (let index in criteria) {
    try {
      criteria[index] = JSON.parse(criteria[index]);
    } catch (error) {
      console.error(error);
    }
  }
  let dataQuery = model
    .find()
    .where(criteria)
    .limit(actionUtil.parseLimit(req))
    .skip(actionUtil.parseSkip(req))
    .sort(actionUtil.parseSort(req));
  selectQuery
    ? (dataQuery = dataQuery.select(selectQuery).populate(populateQuery))
    : (dataQuery = dataQuery.populateAll());

  const countQuery = model.count().where(criteria);
  return { dataQuery, countQuery };
};
