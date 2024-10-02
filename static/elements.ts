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

export { elementIdle, elementCompleted };
