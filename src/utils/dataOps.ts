import { trpc } from "@/utils/trpc";
import { OnboardingButton, accounts } from "@/utils/getMetaMaskHelper"

export default function dataOps() {

const data = trpc.useQuery(["get-NFT-by-Id", {id: accounts}])


}

