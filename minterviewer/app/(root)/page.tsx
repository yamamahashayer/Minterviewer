import { Button } from '@/components/ui/button'
import Link from 'next/dist/client/link'
import React from 'react'
import Image from 'next/image'
import { dummyInterviews } from '@/constants'
import InterviewCard from '@/components/InterviewCard'
const page = () => {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gab-6 max-w-lg ">
          <h2>Get Interview Ready With Ai-Powered Practice & FeedBack </h2>
          <p className="text-lg">
            Practice on real interview questions, get instant feedback, and improve your skills with our AI-powered platform.
          </p>
          <Button asChild className="btn-primary">
            <Link href="/interview">  Start An Interview
            </Link>
          </Button>
        </div>
        <Image src="/robot.png" alt="Robo-Dude" width={400} height={400} className="max-sm:hidden" />
      </section>
      <section className="flex flex-col gap-6 mt-8 ">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
        </div>
        {/* <p>You haven&apos;t taken any interviews yet.</p> */}
      </section>
      <section className="flex flex-col gap-6 mt-8 ">
        <h2>Take an Interview </h2>
        <div className="interviews-section">
          <div className="interviews-section">
            {dummyInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))}
          </div>


        </div>
      </section>
    </>
  )
}

export default page