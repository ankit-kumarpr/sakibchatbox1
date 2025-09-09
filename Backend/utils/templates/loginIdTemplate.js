module.exports = function loginIdTemplate(name, specialId) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #4CAF50;">Welcome to Gnet 👋</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your login ID has been created successfully. Use the ID below to log in:</p>
      <div style="margin: 20px 0; padding: 10px; background: #f2f2f2; border-radius: 5px; text-align: center;">
        <h3 style="margin: 0; color: #333;">Your Login ID:</h3>
        <p style="font-size: 24px; font-weight: bold; color: #4CAF50;">${specialId}</p>
      </div>
      <p>Keep this ID secure and don’t share it with anyone.</p>
      <p>Thanks,<br>Team Gnet</p>
    </div>
  `;
};
