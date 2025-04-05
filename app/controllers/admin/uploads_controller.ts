import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class UploadsController {
  public async upload({ request, response }: HttpContext) {
    const file = request.file('file')

    if (!file) {
      return response.status(400).send({ error: 'No file uploaded' })
    }

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']
    if (!allowedExtensions.includes(file.extname || '')) {
      return response.status(400).send({ error: 'File must be an image' })
    }

    const fileName = `${new Date().getTime()}-${file.clientName}`
    await file.move(app.makePath('uploads'), {
      name: fileName,
    })

    return response.status(200).send({
      location: `/uploads/${fileName}`,
      success: true,
      message: 'File uploaded successfully',
    })
  }
}
