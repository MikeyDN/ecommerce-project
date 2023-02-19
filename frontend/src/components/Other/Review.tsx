import React from 'react'
import { Card } from 'react-bootstrap'
import { Review } from '../../lib/types'

export default function ReviewComponent({ review }: { review: Review }) {
  const date = new Date(review.purchased_at)
  return (
    <Card className="review">
      <div className="review-content">
        <h2>{review.client}</h2>
        <p>{review.review}</p>
      </div>
      <div className="review-author">
        <p>{date.toDateString()}</p>
      </div>
    </Card>
  )
}
