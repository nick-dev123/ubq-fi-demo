const elementIdle = `
    <div class="idle-jobs__job__info">
        <h3>NAME</h3>
    </div>
    <div class="idle-jobs__job__labels">
        <label class="idle-jobs__job__labels__pricing">
            PRICING
        </label>
        <label class="idle-jobs__job__labels__time">
            TIME
        </label>
        <label class="idle-jobs__job__labels__priority">
            PRIORITY
        </label>
        <!-- <img src="logo.png"> -->
    </div>
`;

const elementCompleted = `
    <div class="completed-job">
        <div>
            <span>NAME</span>
        </div>
        <button>STATUS</button>
    </div> 
`;

const elementPromptHelp = `
    <table>
        <thead>
            <tr>
                <th>Command</th>
                <th>Description</th>
                <th>Example</th>
            </tr>
        </thead>  
        <tbody>
            <tr>
                <td class="code">/help</td>
                <td>List all available commands.</td>
                <td class="code">/help</td>
            </tr>
            <tr>
                <td>/allow</td>
                <td>Allows the user to modify the given label.</td>
                <td>/allow @user1 label</td>
            </tr>
            <tr>
                <td>/query</td>
                <td>Returns the user&#39;s wallet, access, and multiplier information.</td>
                <td>/query @ubiquibot</td>
            </tr>
            <tr>
                <td>/start</td>
                <td>Assign yourself to the issue.</td>
                <td>/start</td>
            </tr>
            <tr>
                <td>/stop</td>
                <td>Unassign yourself from the issue.</td>
                <td>/stop</td>
            </tr>
            <tr>
                <td>/wallet</td>
                <td>Register your wallet address for payments.</td>
                <td>/wallet ubq.eth</td>
            </tr>
        </tbody>
    </table>
`;

const elementPromptWalletRegistration = '<span class="pl-mil">+ Successfully registered wallet address</span>';

const elementPromptInvalid = '<span class="pl-bad">!Invalid prompt</span>';

const elementPromptWalletSuccess = '<span class="pl-mil">+ Successfully registered wallet address</span>';

const elementPromptStart = `
            <samp>
              <table>
                  <tr><td>Deadline</td><td>DEADLINE</td></tr>
                  <tr>
                  <td>Beneficiary</td>
                  <td>USER_ADDRESS</td>
                  </tr>
              </table>
            </samp>
            <h6>Tips:</h6>
            <ul>
              <li>Use <code>/wallet 0x0000...0000</code> if you want to update your registered payment wallet address.</li>
              <li>Be sure to open a draft pull request as soon as possible to communicate updates on your progress.</li>
              <li>Be sure to provide timely updates to us when requested, or you will be automatically unassigned from the task.</li>
            <ul>
        `;

const elementPromptWalletWarning = '<span class="pl-mc">!</span> Please set your wallet address with the /wallet command first and try again.';

export {
  elementIdle,
  elementCompleted,
  elementPromptStart,
  elementPromptHelp,
  elementPromptInvalid,
  elementPromptWalletRegistration,
  elementPromptWalletSuccess,
  elementPromptWalletWarning,
};
