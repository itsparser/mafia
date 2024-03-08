"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

const SAMPLE_DATA = [
  "Player 1",
  "Player 2",
  "Player 3",
  "Player 4",
  "Player 5",
];

function vote(){
  //
}

export default function Game({ params }: { params: { session: string } }) {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card>
      <CardBody>
        <p>Make beautiful websites regardless of your design experience.</p>
      </CardBody>
    </Card>
      <Card className="min-w-[400px]">
        <CardHeader className="flex gap-3">Cast your vote</CardHeader>
        <Divider />
        <CardBody>
          <div className="grid gap-y-4">
            {SAMPLE_DATA.map((data) => (
              <Button onClick={vote} key={data}>{data}</Button>
            ))}
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
