import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FocusList from '../../components/FocusList'

const makeTopic = (id: string, title: string, needs: number) => ({
  id,
  title,
  cards: Array.from({ length: needs + 1 }).map((_, i) => ({
    id: `${id}-card-${i}`,
    topicId: id,
    question: `q${i}`,
    answer: `a${i}`,
    status: i === 0 && needs > 0 ? 'needsReview' : 'unreviewed',
  })),
})

describe('FocusList', () => {
  it('shows topics that need review', () => {
    const topics = [makeTopic('t1', 'Topic 1', 1), makeTopic('t2', 'Topic 2', 0)]
    render(<FocusList topics={topics as any} />)

    expect(screen.getByText('Focus List')).toBeInTheDocument()
    // Topic 1 should be listed with count
    expect(screen.getByText(/Topic 1/)).toBeInTheDocument()
  })

  it('shows empty state when no topics need review', () => {
    const topics = [makeTopic('t1', 'Topic 1', 0), makeTopic('t2', 'Topic 2', 0)]
    render(<FocusList topics={topics as any} />)

    expect(screen.getByText("No cards marked for review. You’re all set.")).toBeInTheDocument()
  })
})
