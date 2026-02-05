module.exports = function checkRequiredFields(req, res, next) {
  try {
    const { teamName, teamLead, teamMembers } = req.body;

    if (!teamName || !teamLead || !Array.isArray(teamMembers)) {
      return res.status(400).json({
        msg: "Please fill all required fields",
      });
    }

    if (!teamName.trim()) {
      return res.status(400).json({
        msg: "Team name is required",
      });
    }

    const leadRequiredFields = [
      "name",
      "regnum",
      "email",
      "mobile",
      "department",
      "year",
      "tshirtSize",
    ];

    for (const field of leadRequiredFields) {
      if (!teamLead[field] || !teamLead[field].toString().trim()) {
        return res.status(400).json({
          msg: `Please fill team lead ${field}`,
        });
      }
    }

    if (teamMembers.length === 0) {
      return res.status(400).json({
        msg: "At least 3 team members are required",
      });
    }

    for (let i = 0; i < teamMembers.length; i++) {
      const member = teamMembers[i];

      const memberRequiredFields = [
        "name",
        "regnum",
        "email",
        "mobile",
        "department",
        "year",
        "tshirtSize",
      ];

      for (const field of memberRequiredFields) {
        if (!member[field] || !member[field].toString().trim()) {
          return res.status(400).json({
            msg: `Please fill all fields for member ${i + 1}`,
          });
        }
      }
    }

    next();

  } catch (error) {
    console.error("Required field validation error:", error);
    return res.status(500).json({
      msg: "Server error while validating data",
    });
  }
};
