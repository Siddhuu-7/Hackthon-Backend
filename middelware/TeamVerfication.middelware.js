module.exports = function checkDuplicates(req, res, next) {
  const { teamLead, teamMembers } = req.body;
  
  if (!teamLead || !Array.isArray(teamMembers)) {
    return res.status(400).json({
      msg: "Invalid data structure",
    });
  }

  const emailSet = new Set();
  const mobileSet = new Set();

 
  if (teamLead.email) {
    emailSet.add(teamLead.email.trim().toLowerCase());
  }

  if (teamLead.mobile) {
    mobileSet.add(teamLead.mobile.trim());
  }

  for (let i = 0; i < teamMembers.length; i++) {
    const member = teamMembers[i];

    if (member.email) {
      const email = member.email.trim().toLowerCase();
      if (emailSet.has(email)) {
        return res.status(400).json({
          msg: `Duplicate email found: ${member.email}`,
        });
      }
      emailSet.add(email);
    }

    if (member.mobile) {
      const mobile = member.mobile.trim();
      if (mobileSet.has(mobile)) {
        return res.status(400).json({
          msg: `Duplicate mobile number found: ${member.mobile}`,
        });
      }
      mobileSet.add(mobile);
    }
  }

  next();
};
