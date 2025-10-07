import {contactService} from "../services/contact.service.js";

export async function findUserContacts (req, res, next) {
  try {
    const userId = req.currentUserId;
    const result = await contactService.findUserContacts(userId);
    return res.status(201).json({result});
  } catch(e) {
    res.status(400).json({error: e});
    next(e);
  }
}

export async function createUserContact (req, res, next) {
  try {
    const userId = req.currentUserId;
    const { firstName, lastName, phone } = req.body;

    if (!firstName || !lastName || !phone) {
      return res.status(400).json({error: "firstName, lastName, phone est obligatoire."})
    }

    const result = await contactService.createUserContact(userId, { firstName, lastName, phone });
    return res.status(201).json({result});
  } catch(e) {
    res.status(400).json({error: e});
    next(e);
  }
}

export async function updateUserContactById (req, res, next) {
  try {
    const contactId = req.params.id;
    const { firstName, lastName, phone } = req.body;
    const result = await contactService.updateUserContact( contactId, { firstName, lastName, phone } );
    return res.status(201).json({result});
  } catch(e) {
    res.status(400).json({error: e});
    next(e);
  }
}

export async function deleteUserContactById (req, res, next) {
  try {
    const contactId = req.params.id;
    const result = await contactService.deleteUserContact(contactId);
    return res.status(201).json({result});
  } catch(e) {
    res.status(400).json({error: e});
    next(e);
  }
}