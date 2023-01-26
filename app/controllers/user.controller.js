const { graphql, GraphqlResponseError } = require("@octokit/graphql");
const graphqlWithAuth = graphql.defaults({
    headers: {
        authorization: `bearer ${process.env.GITHUB_PAT}`,
    },
});


exports.list = async (req, res) => {

    const { login } = req.body
    const dynamicQuery = login.map(login => `${login}: user(login: "${login}") { ...UserFragment }`).join("\n")
    let data = {};

    try {
        data = await graphqlWithAuth(`
            {
            ${dynamicQuery}
        }
        
        fragment UserFragment on User {
            name
            login
            company
            repositories(privacy: PUBLIC) {
                totalCount
            }
            followers {
                totalCount
            }
        }`);
    } catch (error) {
        if (error instanceof GraphqlResponseError) {
            data = error.response.data
            console.log("Request failed:", error.request); // { query, variables: {}, headers: { authorization: 'token secret123' } }
            console.log(error.message); // Field 'bioHtml' doesn't exist on type 'User'
        } else {
            // handle non-GraphQL error
        }
    }

    const sortedData = Object.keys(data).sort().reduce(
        (obj, key) => {
            obj[key] = data[key];
            return obj;
        },
        {}
    );

    res.json(sortedData)
}