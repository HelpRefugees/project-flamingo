const editableFields = [
  "/overview",
  "/operatingEnvironment",
  "/keyActivity",
  "/completed",
  "/beneficiaryFeedback",
  "/challengesFaced",
  "/incidents"
];

const replace = (object, path, value) => {
  if ((path.match(/\//g) || []).length !== 1) {
    throw new Error("cannot handle nested paths");
  }
  object[path.slice(1)] = value;
};

exports.updateReport = (report, changes) => {
  for (const { op, path, value } of changes) {
    if (editableFields.indexOf(path) === -1) {
      throw new Error(`cannot edit ${path}`);
    }

    switch (op) {
      case "replace":
        if (path === "/completed") {
          if (value && !report.completed) {
            report.submissionDate = new Date().toISOString();
          } else if (!value && report.completed) {
            delete report.submissionDate;
          }
        }
        replace(report, path, value);
        break;
      default:
        throw new Error(`cannot handle ${op} operation`);
    }
  }
};
