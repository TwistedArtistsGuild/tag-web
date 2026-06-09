/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { IoDownloadOutline, IoDocumentTextOutline, IoImageOutline } from 'react-icons/io5'
import Image from 'next/image'

/**
 * FileAttachment - Display file attachments in messages
 * 
 * @param {Object} props
 * @param {Object} props.file - File object with url, name, type, size
 * @param {boolean} props.compact - Show compact version
 */
const FileAttachment = ({ file, compact = false }) => {
  const isImage = file.fileType?.startsWith('image/') || file.fileType === 'image'
  const fileSize = formatFileSize(file.fileSize)

  if (isImage && !compact) {
    return (
      <div className="my-2 rounded-lg overflow-hidden max-w-sm">
        <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
          <Image
            src={file.fileUrl}
            alt={file.fileName}
            width={400}
            height={300}
            className="object-cover hover:opacity-90 transition-opacity"
          />
        </a>
        <div className="text-xs text-base-content/70 mt-1">
          {file.fileName} ({fileSize})
        </div>
      </div>
    )
  }

  return (
    <a
      href={file.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 p-2 rounded-lg bg-base-300 hover:bg-base-200 transition-colors"
    >
      {isImage ? (
        <IoImageOutline className="text-xl text-primary" />
      ) : (
        <IoDocumentTextOutline className="text-xl text-primary" />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{file.fileName}</div>
        <div className="text-xs text-base-content/70">{fileSize}</div>
      </div>
      <IoDownloadOutline className="text-lg" />
    </a>
  )
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export default FileAttachment