import { useEffect, useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ContactCard } from '../components/shared/ContactCard'
import { useToast } from '../hooks/useToast'
import { useAuth } from '../hooks/useAuth'
import {
  addContact,
  deleteContact,
  getContacts,
  getUsers,
} from '../api/contacts'
import type { ContactResponse, ContactUser } from '../types/contact'
import { useNavigate } from 'react-router-dom'

function isUserInContacts(user: ContactUser, contacts: ContactResponse[]): boolean {
  return contacts.some(
    (c) => c.contact_user_id === user.id || c.contact_username === user.username,
  )
}

export default function UsersPage() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()

  const [contacts, setContacts] = useState<ContactResponse[]>([])
  const [users, setUsers] = useState<ContactUser[]>([])
  const [loading, setLoading] = useState(false)
  const [addingUserId, setAddingUserId] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const [contactList, userList] = await Promise.all([
        getContacts(),
        getUsers(),
      ])
      setContacts(contactList)
      setUsers(userList)
    } catch (err) {
      console.error(err)
      showToast('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const handleAddFromRow = async (user: ContactUser) => {
    try {
      setAddingUserId(user.id)
      await addContact({ contact_username: user.username })
      showToast('Contact added', 'success')
      await loadData()
    } catch (err) {
      console.error(err)
      showToast('Failed to add contact', 'error')
    } finally {
      setAddingUserId(null)
    }
  }

  const handleDelete = async (id: string) => {
    const prevContacts = contacts
    setContacts((list) => list.filter((c) => c.id !== id))
    try {
      await deleteContact(id)
      showToast('Contact deleted', 'success')
    } catch (err) {
      console.error(err)
      setContacts(prevContacts)
      showToast('Failed to delete contact', 'error')
    }
  }

  const openTransferForAccount = (accountNumber: string) => {
    navigate('/transfer', {
      state: { toAccountNumber: accountNumber },
    })
  }

  const otherUsers = users.filter((u) => u.username !== currentUser?.username)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">
          Users
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Find users and add them as contacts to transfer faster.
        </p>
      </header>

      <section>
        <Card title="All users" description="Add users as your contacts">
          {loading && users.length === 0 ? (
            <p className="text-sm text-slate-400">Loading users...</p>
          ) : otherUsers.length === 0 ? (
            <p className="text-sm text-slate-400">No other users found.</p>
          ) : (
            <ul className="space-y-2">
              {otherUsers.map((u) => {
                const inContacts = isUserInContacts(u, contacts)
                return (
                  <li
                    key={u.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2"
                    draggable
                    onDragStart={(event) => {
                      if (!u.account_number) return
                      event.dataTransfer.setData(
                        'text/plain',
                        `<account_number:${u.account_number}>`,
                      )
                    }}
                  >
                    {!inContacts ? (
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={addingUserId === u.id}
                        onClick={() => handleAddFromRow(u)}
                      >
                        {addingUserId === u.id ? 'Adding…' : 'Add contact'}
                      </Button>
                    ) : (
                      <span className="w-24 text-xs text-slate-500">In contacts</span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-200">
                        {u.full_name || u.username}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        @{u.username} · Account: {u.account_number}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </section>

      <section>
        <Card title="Your contacts" description="Transfer or remove contacts">
          {loading && contacts.length === 0 ? (
            <p className="text-sm text-slate-400">Loading contacts...</p>
          ) : contacts.length === 0 ? (
            <p className="text-sm text-slate-400">
              You don&apos;t have any contacts yet. Add users above.
            </p>
          ) : (
            <div className="space-y-3">
              {contacts.map((c) => (
                <ContactCard
                  key={c.id}
                  fullName={c.contact_full_name}
                  username={c.contact_username}
                  accountNumber={c.contact_account_number}
                  nickname={c.nickname}
                  onTransfer={() => openTransferForAccount(c.contact_account_number)}
                  onDelete={() => handleDelete(c.id)}
                />
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}
