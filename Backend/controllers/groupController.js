const Group = require("../models/Group");
const User = require("../models/User");
const generate6DigitId = require("../utils/generateId"); // Optional if needed elsewhere

const createGroup = async (req, res) => {
  try {
    const { name, userIds = [] } = req.body;
    const creatorId = req.user.id;

    const superAdmin = await User.findOne({ role: "superadmin" });
    const validUsers = await User.find({ _id: { $in: userIds } });

    const allUserIds = Array.from(
      new Set([
        ...validUsers.map((u) => u._id.toString()),
        superAdmin._id.toString(),
      ])
    );

    const group = new Group({
      name,
      createdBy: creatorId,
      users: allUserIds,
    });

    await group.save();
    res.status(201).json({ message: "Group created successfully", group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Group creation failed" });
  }
};

// ✅ Add multiple users to existing group
const addUsersToGroup = async (req, res) => {
  try {
    const { groupId, userIds } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const validUsers = await User.find({ _id: { $in: userIds } });

    validUsers.forEach((user) => {
      if (!group.users.includes(user._id)) {
        group.users.push(user._id);
      }
    });

    await group.save();
    res.json({ message: "Users added to group successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add users" });
  }
};

// ✅ Remove multiple users from group
const removeUsersFromGroup = async (req, res) => {
  try {
    const { groupId, userIds } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    group.users = group.users.filter((id) => !userIds.includes(id.toString()));

    await group.save();
    res.json({ message: "Users removed from group successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove users" });
  }
};

// ✅ Get groups visible to the logged-in user
const getGroups = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    let groups = [];

    if (currentUser.role === "superadmin") {
      groups = await Group.find().populate("users", "name role");
    } else if (currentUser.role === "admin") {
      groups = await Group.find({ createdBy: currentUser._id }).populate(
        "users",
        "name role"
      );
    } else {
      groups = await Group.find({ users: currentUser._id }).populate(
        "users",
        "name role"
      );
    }

    res.json({ groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

// get group by groupId

const GetgroupBYId=async(req,res)=>{
   try {
        const group = await Group.findById(req.params.groupId)
            .populate('users', 'name email'); // populate user names

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json(group);
    } catch (err) {
        console.error('Error getting group:', err);
        res.status(500).json({ message: 'Server error' });
    }
}


module.exports={
    createGroup,
    getGroups,
    removeUsersFromGroup,
    addUsersToGroup,
    GetgroupBYId
    
}
