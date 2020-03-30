/**
 * @Author: dylanlawless
 * @Date:   2020-01-18T14:59:15+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-02-24T12:43:18+00:00
 */

  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;


  const RolesSchema = new Schema({

    role_id: {
      type: Boolean,
      required: true
      },
      role_name: {
        type: String,
        required: true
    }

  });

  const Role = mongoose.model('Role', RolesSchema);

  module.exports = Role;
