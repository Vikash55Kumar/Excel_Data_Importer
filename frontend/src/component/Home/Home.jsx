import React from 'react'
import MyDropzone from '../Dropzone/Dropzone'
import Table from '../Table/Table'
import { useSelector } from 'react-redux'

export default function Home() {
  const {sheetDetail} = useSelector((state) => state.sheetDetail)

  return (
    <div>
        <MyDropzone />
        <Table sheetDetail={sheetDetail}/>
    </div>
  )
}
