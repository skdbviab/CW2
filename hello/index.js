module.exports = async function (context, req) {
    context.res = {
        status: 200,
        body: "Hello! If you see this, Azure Functions is working correctly. Timestamp: " + new Date().toISOString()
    };
};