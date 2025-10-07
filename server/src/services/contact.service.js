import {Contact} from "../models/contact.model.js"
import {User} from "../models/user.model.js"

export const contactService = {
  async findUserContacts(userId) {
    try {
      const contacts = await Contact.find({userId: userId});
      return contacts;
    } catch {
      const err = new Error("UserID n'est pas valide");
      err.status = 400;
      throw err;
    }
  },

  async createUserContact(userId, {firstName, lastName, phone}) {
    const doc = await Contact.create({
      userId,
      firstName,
      lastName,
      phone
    });
    return {
      id: doc._id.toString(),
      firstName: doc.firstname,
      lastName: doc.lastName,
      phone: doc.phone,
      userId: userId,
    };
  },

  async updateUserContact(contactId, {firstName, lastName, phone}) {
    const doc = await Contact.findById(contactId);
    doc.firstName = firstName;
    doc.lastName = lastName;
    doc.phone = phone;
    try {
      await doc.save();
      return doc
    } catch (e) {
      console.error("Erreur lors de la sauvegarde:", e);
    }
  },

  async deleteUserContact(contactId) {
    const doc = await Contact.findById(contactId);
    try {
      await doc.deleteOne();
      return ({message: "Le contact " + contactId + "est bien supprimé."})
    } catch (e) {
      console.error("Erreur lors de la suppression", e);
    }
  },
}