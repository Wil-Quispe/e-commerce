import { Col, Row } from 'antd'
import User from '../components/Atoms/User'
import { fetchGraphQlQuery } from '../lib/fetchGraphql'

const Users = ({ data }) => {
  console.log(data)
  return (
    <Row>
      <Col>
        {data.thirdUser.map((u) => (
          <User key={u._id} user={u} />
        ))}
        {data.user.map((u) => (
          <User key={u._id} user={u} />
        ))}
      </Col>
    </Row>
  )
}

export const getServerSideProps = async () => {
  const query = `
  query{
    user{
      name
     lastName
     nickName
      img
      age
      phoneNumber
      sendEmail
      country
      city
      district
      addressHome
      reference
      email
      gender
      shopping{
        _id
      }
      cart{
        productId
      }
    }
    thirdUser{
      name
     lastName
     nickName
      img
      age
      phoneNumber
      sendEmail
      country
      city
      district
      addressHome
      reference
      email
      gender
      shopping{
        _id
      }
      cart{
        productId
      }
    }
  }

  `

  const data = await fetchGraphQlQuery(query)

  return { props: { data } }
}

export default Users
