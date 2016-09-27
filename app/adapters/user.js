import DefaultRestAdapter from 'xprt/adapters/application';

var UserAdapter=DefaultRestAdapter.extend({
	createRecord: function(store, type, record) {
        var data = {};
        var serializer = store.serializerFor(type.typeKey);

        serializer.serializeIntoHash(data, type, record, { includeId: true });

        return this.ajax(this.namespace+'/signup', "POST", { data: data });
    }
});

export default UserAdapter;
