
module.exports = {
    Query: {
        controller(obj, args, context, info) {
            return {
                uid: args.uid,
                mode: "exe",
                accessKey: "accessKey"
            }
        },
    }
};
