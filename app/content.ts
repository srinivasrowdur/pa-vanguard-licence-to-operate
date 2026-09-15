export type Role =
  | 'Everyone'
  | 'Delivery & transformation'
  | 'Engineering & technology'
  | 'Data & analytics'
  | 'Risk & assurance';
export const roles: Role[] = [
  'Everyone',
  'Delivery & transformation',
  'Engineering & technology',
  'Data & analytics',
  'Risk & assurance',
];
export type Chapter = {
  id: number;
  title: string;
  category: string;
  minutes: number;
  description: string;
  roles: Role[];
  sections: { title: string; body: string; actions: string[] }[];
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  takeaway: string;
};
export const chapters: Chapter[] = [
  {
    id: 1,
    title: 'Working together at Vanguard',
    category: 'Foundation',
    minutes: 5,
    description:
      'Understand the client, our shared purpose and your place in the engagement.',
    roles: [],
    sections: [
      {
        title: 'Start with the investor',
        body: 'Vanguard’s public purpose centres on treating investors fairly and giving them the best chance for investment success. For a PA team, this is useful context for everyday delivery: consider how a change affects the people who use a service, the reliability they depend on and the information they trust it with.',
        actions: [
          'Connect your work to an agreed client outcome.',
          'Ask who benefits, what improves and how that improvement will be evidenced.',
          'Confirm the business area and users in scope with your Vanguard counterpart.',
        ],
      },
      {
        title: 'Bring ingenuity into the team',
        body: 'PA describes its purpose as bringing ingenuity to life. In this engagement, use curiosity and practical problem-solving to help the joint team make progress. Listen to the existing context before proposing a solution, make assumptions visible and work with the people who will operate the result.',
        actions: [
          'Understand what the team has already tried.',
          'Build on proven patterns before introducing a new approach.',
          'Make space for operational, delivery and assurance perspectives.',
        ],
      },
      {
        title: 'Make your first conversation count',
        body: 'Before taking on a deliverable, agree the outcome, the receiving owner and how you will work together. This playbook is a proposed onboarding aid. Your agreed statement of work, approved client policies and engagement governance remain the sources to confirm actual responsibilities.',
        actions: [
          'Identify your PA engagement lead and Vanguard delivery counterpart.',
          'Locate the agreed objectives, backlog and ways of working.',
          'Raise missing access, unclear ownership or conflicting expectations early.',
        ],
      },
    ],
    question: 'You join a new workstream. What is the most useful first step?',
    options: [
      'Start building a solution from your previous engagement.',
      'Confirm the intended client outcome, context and owner.',
      'Wait until a problem appears before speaking to the team.',
    ],
    answer: 1,
    explanation:
      'Understanding the outcome and ownership gives you the context to contribute effectively.',
    takeaway:
      'Before starting work, confirm the client outcome, scope and receiving owner.',
  },
  {
    id: 2,
    title: 'Your engagement & responsibilities',
    category: 'Foundation',
    minutes: 6,
    description:
      'Get clear on scope, ownership and the decisions you are empowered to make.',
    roles: [],
    sections: [
      {
        title: 'Know the boundaries of your work',
        body: 'A statement of work describes the agreed engagement. Read it alongside the delivery plan so you understand outcomes, dependencies, assumptions and acceptance criteria. A request can sound small while changing effort, access needs or risk.',
        actions: [
          'Locate the current agreed statement of work and delivery plan.',
          'Confirm what is in scope, what is excluded and what you depend on.',
          'Ask your engagement lead to resolve conflicting instructions.',
        ],
      },
      {
        title: 'Separate contribution from approval',
        body: 'Producing a recommendation or an implementation does not automatically give you authority to approve it. Decision rights must be agreed for the engagement. Confirm who can approve a change, accept a deliverable or accept a risk; do not infer authority from job titles.',
        actions: [
          'Identify the approver for your deliverables.',
          'Record decisions and their rationale in the agreed location.',
          'Refer scope or risk acceptance decisions to the authorised owner.',
        ],
      },
      {
        title: 'Handle changes transparently',
        body: 'When priorities change, make the impact visible before committing. Discuss dependencies, effort, timescales and controls with your PA lead and Vanguard counterpart. Use the agreed change route so that the delivery record reflects what was actually authorised.',
        actions: [
          'Describe the requested change and why it is needed.',
          'Assess effects on outcomes, dependencies and controls.',
          'Obtain the relevant decision before starting work outside agreed scope.',
        ],
      },
    ],
    question:
      'A stakeholder asks for additional work beyond the agreed scope. What should you do?',
    options: [
      'Agree immediately to preserve momentum.',
      'Ignore it because it is outside the statement of work.',
      'Discuss the impact with the engagement lead and follow the agreed change route.',
    ],
    answer: 2,
    explanation:
      'Scope changes need a visible impact assessment and the appropriate decision.',
    takeaway:
      'A request is not an approval. Confirm scope and decision rights before committing.',
  },
  {
    id: 3,
    title: 'Protecting client information',
    category: 'Essential',
    minutes: 6,
    description:
      'Handle information with care, from your first day to your final handover.',
    roles: [],
    sections: [
      {
        title: 'Understand what you are handling',
        body: 'Client information can include personal information, internal plans, system details and business records. Confirm its classification, permitted use and approved storage before working with it. The correct handling requirements depend on the data and applicable client policy.',
        actions: [
          'Use only the information needed for the task.',
          'Check handling rules with the relevant information owner.',
          'Avoid copying sensitive details into meeting notes or screenshots unnecessarily.',
        ],
      },
      {
        title: 'Use approved environments',
        body: 'Work within the tools and locations approved for this engagement. Access to a tool does not establish permission to put client information into it. This also applies to AI assistants, translation services, personal email and file-sharing services.',
        actions: [
          'Confirm a tool is approved for the specific information and use case.',
          'Use synthetic or approved masked information for examples and testing.',
          'Check recipients and sharing permissions before sending a document.',
        ],
      },
      {
        title: 'Respond to an accidental disclosure',
        body: 'If information may have been sent to the wrong person or exposed, report the facts promptly through the agreed client incident route and inform your PA engagement lead. Do not conceal it or assume that deleting a message resolves the incident.',
        actions: [
          'Stop further sharing and preserve the relevant facts.',
          'Record what was shared, when and with whom.',
          'Follow the incident team’s instructions for containment and communications.',
        ],
      },
    ],
    question:
      'You want to summarise a client document with an AI assistant. What must happen first?',
    options: [
      'Confirm that the tool and intended use are approved for that information.',
      'Remove the client name; that always makes the document safe to upload.',
      'Use a personal account so it does not affect the client environment.',
    ],
    answer: 0,
    explanation:
      'Approval must cover the tool, the information and the purpose. Removing a name alone is not enough.',
    takeaway:
      'Before sharing information, check its classification, destination and permitted use.',
  },
  {
    id: 4,
    title: 'Access & secure working',
    category: 'Essential',
    minutes: 5,
    description:
      'Work safely with the right access, approved devices and clear boundaries.',
    roles: [],
    sections: [
      {
        title: 'Get only the access you need',
        body: 'Request access for a defined task through the approved route. Confirm the system owner, the level of access and any expiry or review requirement. Access should match your responsibilities and be removed when it is no longer needed.',
        actions: [
          'Describe the business need when requesting access.',
          'Use your own approved identity; never borrow another person’s account.',
          'Report unexpected or excessive permissions.',
        ],
      },
      {
        title: 'Protect accounts and devices',
        body: 'Follow the applicable device, authentication and remote-working requirements. Keep credentials out of code, documents and chat. Treat unexpected sign-in prompts and requests to transfer files as reasons to verify the request through a known channel.',
        actions: [
          'Use the required authentication controls.',
          'Lock your session when you step away.',
          'Report suspicious messages or account behaviour through the agreed route.',
        ],
      },
      {
        title: 'Keep privileged work deliberate',
        body: 'Elevated access can have a broad impact. Confirm the approval, planned activity and rollback approach before making a privileged change. Emergency access should follow the client’s established process rather than an improvised workaround.',
        actions: [
          'Use approved privileged access mechanisms where required.',
          'Record the change and preserve the required evidence.',
          'Remove temporary permissions after the activity is complete.',
        ],
      },
    ],
    question:
      'A colleague offers their credentials while your access request is pending. What should you do?',
    options: [
      'Use them briefly and delete the message afterwards.',
      'Decline and resolve the access request through the approved route.',
      'Share the credentials with the whole workstream.',
    ],
    answer: 1,
    explanation:
      'Individual approved access preserves accountability and avoids credential sharing.',
    takeaway:
      'Use individual approved access. Urgency does not make shared credentials appropriate.',
  },
  {
    id: 5,
    title: 'Ways of working & delivery quality',
    category: 'Delivery',
    minutes: 6,
    description:
      'Turn shared priorities into clear, reviewable and reliable outcomes.',
    roles: [],
    sections: [
      {
        title: 'Make the work visible',
        body: 'Use the team’s agreed delivery tools and cadence. A useful work item explains the outcome, the owner and what must be true for it to be accepted. Bring blockers to the team early enough for someone to act on them.',
        actions: [
          'Agree acceptance criteria before doing the work.',
          'Keep dependencies, decisions and blockers visible.',
          'Check priorities with the team instead of optimising your task in isolation.',
        ],
      },
      {
        title: 'Build quality into delivery',
        body: 'Quality includes usefulness, reliability, accessibility and maintainability. Agree proportionate review and testing for the deliverable. An analysis needs traceable assumptions; a process needs a workable handover; a software change needs evidence that it behaves as intended.',
        actions: [
          'Select checks based on the risk and intended use.',
          'Seek review from the people with the relevant expertise.',
          'Keep evidence close to the deliverable so others can assess it.',
        ],
      },
      {
        title: 'Learn and reuse',
        body: 'Lessons become valuable when they change the next piece of work. Capture patterns, decisions and limitations in the agreed team location. Reuse an existing pattern only when its assumptions still apply.',
        actions: [
          'Explain why the chosen approach fits the current situation.',
          'Capture a useful example and its limitations.',
          'Feed delivery lessons into planning and team retrospectives.',
        ],
      },
    ],
    question:
      'What provides the strongest evidence that a deliverable is ready for review?',
    options: [
      'It took the expected number of days.',
      'The author says it is complete.',
      'It meets agreed acceptance criteria with proportionate supporting evidence.',
    ],
    answer: 2,
    explanation:
      'Readiness depends on agreed outcomes and evidence, not effort or attendance.',
    takeaway:
      'Define acceptance criteria early and retain evidence that they have been met.',
  },
  {
    id: 6,
    title: 'Risk, issues & incident escalation',
    category: 'Essential',
    minutes: 6,
    description: 'Recognise concerns early and get them to the right people.',
    roles: [],
    sections: [
      {
        title: 'Tell a risk from an issue',
        body: 'A risk is something that may affect an outcome. An issue is already affecting it. A suspected incident may involve service disruption, security or information exposure and may need a faster response than the routine delivery log.',
        actions: [
          'Describe the concern, potential impact and affected service or outcome.',
          'Assign or confirm an owner and a next action.',
          'Use the client incident route for suspected incidents rather than waiting for a routine meeting.',
        ],
      },
      {
        title: 'Escalate with useful facts',
        body: 'Provide enough information for the receiving team to act: what happened, when you noticed it, what may be affected and what has already been done. Separate observed facts from assumptions. Confirm the actual routes and contacts at mobilisation.',
        actions: [
          'Notify the appropriate client route and PA engagement lead.',
          'Preserve relevant evidence in approved locations.',
          'Avoid speculative conclusions or broad distribution of sensitive details.',
        ],
      },
      {
        title: 'Respect response authority',
        body: 'Support the people coordinating the response. Do not make unapproved production changes, promise a resolution time or communicate externally on the team’s behalf. Confirm who owns decisions, recovery and communications under the engagement’s incident process.',
        actions: [
          'Follow the appointed response owner’s instructions.',
          'Record actions and decisions as the situation evolves.',
          'Capture lessons once the immediate response has stabilised.',
        ],
      },
    ],
    question:
      'You suspect that client information has been exposed. What is the best next action?',
    options: [
      'Report promptly through the agreed incident route with the facts you have.',
      'Wait until you have proven the full impact.',
      'Post details in a broad team channel to ask for opinions.',
    ],
    answer: 0,
    explanation:
      'Prompt factual reporting lets the authorised team assess and respond without unnecessary disclosure.',
    takeaway:
      'Raise suspected incidents promptly. Share facts through the agreed response route.',
  },
  {
    id: 7,
    title: 'Evidence & responsible decision-making',
    category: 'Essential',
    minutes: 5,
    description:
      'Make decisions traceable and demonstrate the quality of your work.',
    roles: [],
    sections: [
      {
        title: 'Keep an evidence trail',
        body: 'Evidence helps a reviewer understand what was done and why. Keep approved records of decisions, reviews, tests and acceptance in the engagement’s agreed location. Do not claim that this playbook itself demonstrates regulatory compliance.',
        actions: [
          'Link decisions to the relevant requirement or outcome.',
          'Record who reviewed or approved the work and when.',
          'Retain evidence according to the applicable client requirements.',
        ],
      },
      {
        title: 'Raise uncertainty and conflicts',
        body: 'Be open about assumptions, limitations and conflicts of interest. If personal interests or another engagement could affect your judgement, use the appropriate PA and client reporting routes. Seek guidance when an instruction appears inconsistent with agreed responsibilities.',
        actions: [
          'Distinguish an assumption from a confirmed fact.',
          'Disclose potential conflicts through the applicable process.',
          'Escalate pressure to omit material concerns or misrepresent completion.',
        ],
      },
      {
        title: 'Make review straightforward',
        body: 'A good handover to a reviewer includes the outcome, relevant evidence and remaining limitations. Make gaps visible so the authorised owner can decide what happens next. Do not label incomplete work approved because a deadline is near.',
        actions: [
          'Summarise what is complete and what remains.',
          'Link the underlying evidence.',
          'Identify the owner of outstanding decisions or remediation.',
        ],
      },
    ],
    question:
      'A review finds an unresolved limitation just before a deadline. What should you do?',
    options: [
      'Remove it from the summary to avoid delaying sign-off.',
      'Describe the limitation, its impact and the decision needed from the authorised owner.',
      'Mark the deliverable approved and fix it later without a record.',
    ],
    answer: 1,
    explanation:
      'Transparent evidence enables a meaningful decision about acceptance or further work.',
    takeaway:
      'Make decisions traceable and limitations visible. Completion is not the same as approval.',
  },
  {
    id: 8,
    title: 'Secure technology & data delivery',
    category: 'Role-specific',
    minutes: 7,
    description:
      'Apply secure design, reliable data and controlled changes to technical work.',
    roles: ['Engineering & technology', 'Data & analytics', 'Risk & assurance'],
    sections: [
      {
        title: 'Design with controls in mind',
        body: 'For technical work, clarify information flows, trust boundaries and operating responsibilities before implementation. Use the approved architecture and engineering standards for the engagement. Confirm which security and data reviews are required for the proposed change.',
        actions: [
          'Describe the data, integrations and dependencies.',
          'Review assumptions with the relevant architecture or security owner.',
          'Use approved components and check their suitability.',
        ],
      },
      {
        title: 'Test the important failure paths',
        body: 'Validate the behaviour that matters to the client outcome. For code, this includes relevant access controls and failure handling. For data, check quality, lineage and reconciliation. Protect sensitive information in test environments and logs.',
        actions: [
          'Use approved test data and environments.',
          'Test the expected outcome and plausible failure conditions.',
          'Document known limitations and the evidence collected.',
        ],
      },
      {
        title: 'Release with a recovery plan',
        body: 'A successful build or analysis does not authorise a production release. Follow the agreed change process with the required approvals, operational readiness and recovery plan. Confirm who monitors the outcome and who responds if the change causes a problem.',
        actions: [
          'Confirm release ownership, approval and timing.',
          'Prepare proportionate rollback or recovery steps.',
          'Verify the outcome after release and retain evidence.',
        ],
      },
    ],
    question:
      'A technical change passes testing. What else is needed before production release?',
    options: [
      'Nothing; passing tests is release approval.',
      'Only a message to the team saying the change is ready.',
      'The required change approval, operational ownership and recovery plan.',
    ],
    answer: 2,
    explanation:
      'Testing is evidence for the release decision; it does not replace the agreed approval and operating process.',
    takeaway:
      'Treat release approval, operational ownership and recovery as part of the change.',
  },
  {
    id: 9,
    title: 'Delivery governance & dependencies',
    category: 'Role-specific',
    minutes: 6,
    description:
      'Keep outcomes, dependencies and decisions under control across the team.',
    roles: ['Delivery & transformation', 'Risk & assurance'],
    sections: [
      {
        title: 'Lead with outcomes and ownership',
        body: 'Translate the agreed engagement into a delivery plan with visible dependencies and decision owners. Confirm what each workstream needs from the others. Avoid reporting activity as progress when the expected outcome is still blocked.',
        actions: [
          'Track progress against accepted outcomes.',
          'Give each dependency and decision an owner.',
          'Revisit the plan when a material assumption changes.',
        ],
      },
      {
        title: 'Report a balanced picture',
        body: 'Useful reporting explains what changed, what is at risk and where a decision is needed. Show evidence for status and make the consequences of delay visible. Keep sensitive personnel or client information out of unnecessarily broad reports.',
        actions: [
          'Explain confidence in dates and outcomes.',
          'Escalate material blockers with options and a recommendation.',
          'Use the agreed governance cadence and urgent escalation routes.',
        ],
      },
      {
        title: 'Address delivery concerns early',
        body: 'When a delivery concern emerges, focus on observable work and the support or action needed. Discuss it through the appropriate leadership route. A people issue, a quality issue and an incident may require different processes and different audiences.',
        actions: [
          'Use specific examples and clear expectations.',
          'Agree an owner, action and review point.',
          'Use specialist routes for sensitive people matters or incidents.',
        ],
      },
    ],
    question:
      'A dependency threatens an agreed milestone. What should the status report include?',
    options: [
      'The impact, owner, options and decision needed.',
      'Only a green status until the date is missed.',
      'A list of everyone who might be responsible.',
    ],
    answer: 0,
    explanation:
      'Actionable reporting supports a timely decision rather than hiding risk or assigning blame.',
    takeaway:
      'Make dependency impacts and decision owners visible before milestones are missed.',
  },
  {
    id: 10,
    title: 'Knowledge transfer & handover',
    category: 'Delivery',
    minutes: 5,
    description:
      'Leave the team ready to own, operate and improve what you deliver.',
    roles: [],
    sections: [
      {
        title: 'Plan the handover from the start',
        body: 'Identify the team that will receive your work and involve them before the end of the engagement. Agree what they need to operate or maintain the deliverable and how they will confirm it is ready.',
        actions: [
          'Name the receiving owner.',
          'Agree the handover artefacts and acceptance criteria.',
          'Schedule walkthroughs before key contributors leave.',
        ],
      },
      {
        title: 'Transfer understanding, not just files',
        body: 'A useful handover explains how something works, why decisions were made and where its limits are. Walk through common tasks and failure scenarios with the receiving team. Check they can find the records and use the agreed operational routes.',
        actions: [
          'Include decisions, runbooks, dependencies and known issues.',
          'Demonstrate a realistic task and invite questions.',
          'Assign owners to remaining actions and risks.',
        ],
      },
      {
        title: 'Close the engagement carefully',
        body: 'Follow the agreed exit process for deliverable acceptance, access removal and information retention or return. Retain only what applicable policy and the engagement permit. Capture lessons so future teams can use them.',
        actions: [
          'Record acceptance or explicitly list remaining conditions.',
          'Confirm access removal through the appropriate owner.',
          'Complete agreed information return, retention or deletion steps.',
        ],
      },
    ],
    question: 'Which handover is most useful to the receiving team?',
    options: [
      'A folder of files sent on the final day.',
      'A walkthrough, usable guidance, known issues and explicit ownership of remaining actions.',
      'An assurance that they can work it out themselves.',
    ],
    answer: 1,
    explanation:
      'A usable handover transfers operational understanding and makes ongoing ownership clear.',
    takeaway:
      'Handover is complete when the receiving team has the understanding and ownership it needs.',
  },
];
export function pathway(role: Role) {
  return chapters.filter((c) => !c.roles.length || c.roles.includes(role));
}
export const assessment = [
  {
    question:
      'A stakeholder’s request conflicts with the agreed deliverable. What do you do?',
    options: [
      'Commit and discuss it afterwards.',
      'Clarify the impact and obtain the decision through the agreed change route.',
      'Choose whichever request is easiest.',
    ],
    answer: 1,
    explanation:
      'Use the agreed decision route before committing to a scope change.',
  },
  {
    question:
      'You need a realistic dataset for a demonstration. What is the safest approach?',
    options: [
      'Use live investor records because the audience is internal.',
      'Download records to a personal device.',
      'Use synthetic or appropriately approved masked data.',
    ],
    answer: 2,
    explanation:
      'Demonstrations should use information approved for that purpose and environment.',
  },
  {
    question:
      'Your access includes administrative permissions you do not need. What next?',
    options: [
      'Report the excess access through the approved route.',
      'Keep it for future convenience.',
      'Offer to perform unrelated changes for others.',
    ],
    answer: 0,
    explanation: 'Access should match the task and responsibilities.',
  },
  {
    question:
      'A possible incident appears during a routine task. What is your priority?',
    options: [
      'Wait for the next status meeting.',
      'Report through the agreed incident route with the known facts.',
      'Tell external stakeholders your initial theory.',
    ],
    answer: 1,
    explanation:
      'Suspected incidents need prompt factual reporting through the appropriate route.',
  },
  {
    question:
      'A receiving team cannot explain how to operate your deliverable. Is handover ready?',
    options: [
      'Yes, if the documentation has been uploaded.',
      'Yes, if your final day has arrived.',
      'No; arrange a walkthrough and confirm outstanding ownership and acceptance.',
    ],
    answer: 2,
    explanation:
      'Handover needs usable understanding and ownership, not merely files.',
  },
];
