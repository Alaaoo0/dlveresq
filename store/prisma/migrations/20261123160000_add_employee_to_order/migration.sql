
-- Add optional employee assignment to orders
ALTER TABLE "Order"
ADD COLUMN "employeeId" TEXT;

-- Index employee assignments
CREATE INDEX "Order_employeeId_idx"
ON "Order"("employeeId");

-- Keep orders if an employee is deleted
ALTER TABLE "Order"
ADD CONSTRAINT "Order_employeeId_fkey"
FOREIGN KEY ("employeeId")
REFERENCES "Employee"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
