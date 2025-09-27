'use client'

import { useState, useCallback } from 'react'

interface FormField {
  value: string
  error: string
  touched: boolean
}

interface FormState {
  [key: string]: FormField
}

interface UseFormOptions {
  initialValues?: Record<string, string>
  validate?: (values: Record<string, string>) => Record<string, string>
  onSubmit?: (values: Record<string, string>) => Promise<void> | void
}

export function useForm(options: UseFormOptions = {}) {
  const { initialValues = {}, validate, onSubmit } = options

  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {}
    Object.keys(initialValues).forEach(key => {
      state[key] = {
        value: initialValues[key],
        error: '',
        touched: false
      }
    })
    return state
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')

  const getValues = useCallback(() => {
    const values: Record<string, string> = {}
    Object.keys(formState).forEach(key => {
      values[key] = formState[key].value
    })
    return values
  }, [formState])

  const getErrors = useCallback(() => {
    const errors: Record<string, string> = {}
    Object.keys(formState).forEach(key => {
      if (formState[key].error) {
        errors[key] = formState[key].error
      }
    })
    return errors
  }, [formState])

  const isValid = useCallback(() => {
    return Object.values(formState).every(field => !field.error) &&
           Object.values(formState).every(field => field.value.trim() !== '' || !field.touched)
  }, [formState])

  const setValue = useCallback((name: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        touched: true
      }
    }))
  }, [])

  const setTouched = useCallback((name: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched: true
      }
    }))
  }, [])

  const validateField = useCallback((name: string) => {
    const field = formState[name]
    if (!field || !field.touched) return

    let error = ''

    // Validações básicas
    switch (name) {
      case 'email':
        if (field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          error = 'Email inválido'
        }
        break
      case 'password':
        if (field.value && field.value.length < 6) {
          error = 'A senha deve ter pelo menos 6 caracteres'
        }
        break
      case 'name':
        if (field.value && field.value.length < 2) {
          error = 'Nome deve ter pelo menos 2 caracteres'
        }
        break
      case 'message':
        if (field.value && field.value.length < 10) {
          error = 'Mensagem deve ter pelo menos 10 caracteres'
        }
        break
      default:
        // Validação obrigatória
        if (field.value.trim() === '') {
          error = 'Este campo é obrigatório'
        }
        break
    }

    // Validação customizada
    if (validate) {
      const customErrors = validate(getValues())
      if (customErrors[name]) {
        error = customErrors[name]
      }
    }

    setFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        error
      }
    }))

    return !error
  }, [formState, validate, getValues])

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // Validar todos os campos
    Object.keys(formState).forEach(name => {
      setTouched(name)
      validateField(name)
    })

    if (!isValid()) {
      return { success: false, errors: getErrors() }
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      if (onSubmit) {
        await onSubmit(getValues())
      }
      return { success: true, values: getValues() }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setSubmitError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsSubmitting(false)
    }
  }, [formState, validateField, isValid, getValues, getErrors, onSubmit, setTouched])

  const reset = useCallback(() => {
    setFormState(prev => {
      const newState: FormState = {}
      Object.keys(prev).forEach(key => {
        newState[key] = {
          value: initialValues[key] || '',
          error: '',
          touched: false
        }
      })
      return newState
    })
    setSubmitError('')
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values: getValues(),
    errors: getErrors(),
    touched: Object.fromEntries(
      Object.entries(formState).map(([key, field]) => [key, field.touched])
    ),
    isSubmitting,
    submitError,
    isValid: isValid(),
    setValue,
    setTouched,
    validateField,
    handleSubmit,
    reset
  }
}
