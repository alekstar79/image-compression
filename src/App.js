import React from 'react'
import './App.scss'

import Header from './components/Header'
import Preview from './components/Preview'
import { compressImage } from './compress'

const { useState } = React

const App = () => {
  const [imgSrc, setImgSrc] = useState('')
  const [imgName, setImgName] = useState('')
  const [resultSrc, setResultSrc] = useState('')
  const [compressPct, setCompressPct] = useState(null)
  const [imgSize, setImgSize] = useState('')
  const [resultSize, setResultSize] = useState('')

  const handleSizeWithUnit = size => {
    const sizeInKb = Math.round(size / 1024)
    const isMb = Math.floor(sizeInKb / 1024)

    return isMb
      ? Number((sizeInKb / 1024).toFixed(1)) + 'mb'
      : sizeInKb + 'kb'
  }

  const onImageUpload = async e => {
    setCompressPct(null)
    setResultSrc('')
    setImgSrc('')

    // get original image
    const file = e.target.files[0]
    const uploadSrc = URL.createObjectURL(file)

    setImgSrc(uploadSrc)
    setImgSize(handleSizeWithUnit(file.size))
    setImgName(file.name.split('.').slice(0, -1).join('.'))

    // get compressed image
    const res = await compressImage(file)
    const resUrl = URL.createObjectURL(res)

    setResultSrc(resUrl)
    setResultSize(handleSizeWithUnit(res.size))

    const pct = Math.round(res.size / file.size * 100)

    setCompressPct(100 - pct)
  }

  const onDownload = () => {
    const a = document.createElement('a')

    a.download = `${imgName}_compressed`
    a.href = resultSrc
    a.click()
  }

  return (
    <>
      <h1>Image Compression Tool</h1>
      <Header
        onImageUpload={onImageUpload}
        onDownload={onDownload}
        pct={compressPct}
      />
      <Preview
        beforeSrc={imgSrc}
        beforeSize={imgSize}
        afterSrc={resultSrc}
        afterSize={resultSize}
      />
    </>
  )
}

export default App
