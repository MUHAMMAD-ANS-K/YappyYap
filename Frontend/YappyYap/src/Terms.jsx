import "./Terms.css"
export default function Terms() {
    return (
        <div className="terms-of-use">
            <h1>Terms of Use</h1><div className="instructions">
                    <ul>
                        <li><span className="red-imp">Note:</span> The options feature for different text styles is under development and doesn't works.</li>
                        <li>There is an anonymity feature to even hide your current name. The anonymity feautres genrates a two name username and it is checked that this username is not the name of any active user but it is not checed for guest, so it is possible to get some guest's username by anonymity feature by chance although the probability is very low.</li>
                        <li>Permanent users get 30 min login sessions while guest 5 minutes. After 5 minutes of permanent users they can sign in and get their origianl usernames while there is no phenomena such as this for guests as an entry is removed from the database after a guest's session expires</li>
                        <li>There is input in seconds for messages and the message gets removed from the chat in n seconds from all user chats. Note here, the message will be removed from database in less than 10s after its expiry as the messages are removed constantly from the database by cron jobs to ensure anonymity so there is no breach of data and this can be verified as this project is open source</li>
                        <li>The voice input is altered in such a way that it is hard to interprete who is the actual person speaking although we are working on hiding this algorithm so some forsenic guy cannot retrace a user's voice to him.</li>
                    </ul>
                    </div>
        </div>
    )
}