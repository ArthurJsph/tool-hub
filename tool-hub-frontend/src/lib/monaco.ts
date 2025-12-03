"use client"

import { loader } from '@monaco-editor/react'

export function configureMonaco() {
    loader.config({
        paths: {
            vs: '/_next/static/monaco/vs',
        },
    })
}
