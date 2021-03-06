import dotenv from 'dotenv'
import GoogleSpreadsheet from 'google-spreadsheet'

dotenv.config()
const doc = new GoogleSpreadsheet(process.env.GOOGLE_DRIVE_USERS_SPREADSHEET)

const readUsersRows = () => new Promise(res => {
  doc.useServiceAccountAuth(JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS), () => {
    doc.getRows(1, (err, rows) => {
      res(rows)
    })
  })
})

export const readUserByPhone = (phone: string) =>
  readUsersRows()
    .then((rows: any[]) => {
      return rows.find(row => row.phone === `+${phone}`)
    })

export const readUsersByPhones = (phones: string[]) =>
  readUsersRows()
    .then((rows: any[]) => {
      return phones.map(phone => {
        const ph = phone.replace(/[\-() ]/gi, '')
        const r = rows.find(r => !!r.phone.includes(ph))

        return ({
          phone,
          telegramId: r ? r.telegramid : null,
        })
      })
    })

export const readUserByTelegramId = (telegramId: number) =>
  readUsersRows()
    .then((rows: any[]) => {
      return rows.find(row => Number(row.telegramid) === telegramId)
    })

export const updateUserTelegramId = (phone: string, telegramId: number | string) =>
  readUserByPhone(phone)
    .then((async row => {
      row.telegramId = telegramId
      await row.save()
      return row
    }))

export default readUsersRows